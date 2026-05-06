import axios from 'axios';
import prisma from '@/lib/server/config/prisma';

interface QuestionLinkUpdate {
  id: number;
  question_link: string;
  new_link?: string;
  should_update: boolean;
}

export class LinkUpdateService {
  private static readonly MAX_REDIRECTS = 5;
  private static readonly REQUEST_TIMEOUT = 10000; // 10 seconds
  private static readonly BATCH_SIZE = 50;

  /**
   * Follow redirects to get the final URL
   */
  static async followRedirect(url: string): Promise<string> {
    try {
      const response = await axios.head(url, {
        timeout: this.REQUEST_TIMEOUT,
        maxRedirects: this.MAX_REDIRECTS,
        validateStatus: () => true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      // Return the final URL after all redirects
      return response.request.res.responseUrl || url;
    } catch {
      // Network/timeout error — fall back to the original URL
      return url;
    }
  }

  /**
   * Update all question links in the database
   */
  static async updateAllQuestionLinks(): Promise<{
    updated: number;
    skipped: number;
    failed: number;
    total: number;
  }> {
    try {
      // Fetch all questions from database
      const allQuestions = await prisma.question.findMany({
        select: {
          id: true,
          question_link: true
        }
      });

      let updated = 0;
      let skipped = 0;
      let failed = 0;

      // Process in batches to avoid memory issues
      for (let i = 0; i < allQuestions.length; i += this.BATCH_SIZE) {
        const batch = allQuestions.slice(i, i + this.BATCH_SIZE);

        const batchResults = await Promise.allSettled(
          batch.map(async (question) => {
            try {
              const newLink = await this.followRedirect(question.question_link);
              const shouldUpdate = newLink !== question.question_link;
              return {
                id: question.id,
                question_link: question.question_link,
                new_link: shouldUpdate ? newLink : undefined,
                should_update: shouldUpdate,
              };
            } catch (error: any) {
              console.error(`[LINK_UPDATE] Error processing question ${question.id}:`, error.message);
              return {
                id: question.id,
                question_link: question.question_link,
                should_update: false
              };
            }
          })
        );

        // Separate successful and failed updates
        const updates: QuestionLinkUpdate[] = [];
        batchResults.forEach((result: any) => {
          if (result.status === 'fulfilled') {
            if (result.value.should_update === true) {
              updates.push(result.value);
            } else {
              skipped++;
            }
          } else if (result.status === 'rejected') {
            failed++;
          }
        });

        // Batch update questions that need new links
        if (updates.length > 0) {
          const dbUpdateResults = await Promise.allSettled(
            updates.map(async (update) => {
              try {
                await prisma.question.update({
                  where: { id: update.id },
                  data: { question_link: update.new_link! }
                });
                return { success: true, id: update.id };
              } catch (error: any) {
                // Handle unique constraint violation gracefully — silent skip
                if (error.code === 'P2002') {
                  return { success: false, id: update.id, error: 'duplicate_link', skipped: true };
                }
                console.error(`[LINK_UPDATE] Failed to update question ${update.id}:`, error.message);
                return { success: false, id: update.id, error };
              }
            })
          );

          // Count successful and failed database updates
          dbUpdateResults.forEach((result) => {
            if (result.status === 'fulfilled') {
              if (result.value.success) {
                updated++;
              } else if (result.value.skipped) {
                skipped++;
              } else {
                failed++;
              }
            } else {
              failed++;
            }
          });
        }

        // Small delay between batches to be respectful
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const total = allQuestions.length;
      return { updated, skipped, failed, total };

    } catch (error: any) {
      console.error('[LINK_UPDATE] Critical error in update process:', error);
      throw error;
    }
  }

  /**
   * Generate completion report (single-line structured log).
   */
  static generateReport(results: { updated: number; skipped: number; failed: number; total: number }) {
    console.log('[LINK_UPDATE] Report:', JSON.stringify(results));
  }
}
