"use client";

import React, { useState } from "react";
import { Plus, Calendar, Clock, FileText, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClassDetailHeaderProps } from '@/types/admin/classDetail.types';

export default function ClassDetailHeader({ selectedBatch, topicSlug, classSlug, classDetails, onAssignClick }: ClassDetailHeaderProps) {
   const [isOpen, setIsOpen] = useState(false);

   const formattedDate = classDetails?.class_date
      ? new Date(classDetails.class_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      : null;

   // Parse HTML description to extract bullet points
   const parseDescriptionToBullets = (html: string): string[] => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const bullets: string[] = [];

      // Extract from <ul> or <ol> lists
      const lists = doc.querySelectorAll('ul, ol');
      lists.forEach(list => {
         const items = list.querySelectorAll('li');
         items.forEach(item => {
            const text = item.textContent?.trim();
            if (text) bullets.push(text);
         });
      });

      // If no lists found, extract from <p> tags
      if (bullets.length === 0) {
         const paragraphs = doc.querySelectorAll('p');
         paragraphs.forEach(p => {
            const text = p.textContent?.trim();
            if (text) bullets.push(text);
         });
      }

      // If still no bullets, split by line breaks
      if (bullets.length === 0) {
         const text = doc.body.textContent?.trim();
         if (text) {
            const lines = text.split(/\n+/).map(l => l.trim()).filter(l => l);
            bullets.push(...lines);
         }
      }

      return bullets;
   };

   const descriptionBullets = classDetails?.description ? parseDescriptionToBullets(classDetails.description) : [];
   const hasDescription = descriptionBullets.length > 0;

   return (
      <>
         {classDetails && (
            <div className="mb-6 rounded-2xl bg-linear-to-br from-background/80 to-background/40 glass backdrop-blur-3xl sm:p-6 shadow-sm">

               {/* TOP META ROW */}
               <div className="flex flex-wrap items-center justify-between gap-4 py-2 px-1">

                  {/* LEFT META */}
                  <div className="flex flex-wrap items-center gap-3">

                     {formattedDate && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                           <Calendar className="w-4 h-4" />
                           {formattedDate}
                        </div>
                     )}

                     {classDetails.duration_minutes && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                           <Clock className="w-4 h-4" />
                           {classDetails.duration_minutes} min
                        </div>
                     )}
                  </div>

                  {/* RIGHT ACTION */}
                  <div className="flex items-center gap-3">
                     {classDetails.pdf_url ? (
                        <a
                           href={classDetails.pdf_url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-200"
                        >
                           <FileText className="w-4 h-4" />
                           View Notes
                        </a>
                     ) : (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-medium bg-muted/50 text-muted-foreground cursor-not-allowed">
                           <FileText className="w-4 h-4" />
                           No Notes
                        </div>
                     )}
                     <Button
                        onClick={onAssignClick}
                        className="gap-2 h-10 px-4 rounded-xl shrink-0"
                     >
                        <Plus className="w-4 h-4" />
                        Assign Questions
                     </Button>
                  </div>
               </div>

               {/* TITLE */}
               <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight mb-3">
                  {classDetails.class_name}
               </h1>

               {/* 🔽 ACCORDION */}
               {hasDescription && (
                  <div className="mt-4 border border-border/40 rounded-2xl overflow-hidden">

                     {/* HEADER */}
                     <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-primary hover:bg-muted/20 transition"
                     >
                        <span>View Description</span>

                        <ChevronDown
                           className={`w-4 h-4 text-primary transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                           }`}
                        />
                     </button>

                     {/* CONTENT */}
                     <div
                        className={`transition-all duration-300 ease-in-out ${
                           isOpen ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
                        } overflow-hidden`}
                     >
                        <div className="px-4 pb-4 pt-1">
                           <ul className="space-y-2 text-muted-foreground text-sm max-w-3xl leading-relaxed list-disc list-inside">
                              {descriptionBullets.map((bullet, index) => (
                                 <li key={index}>{bullet}</li>
                              ))}
                           </ul>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         )}
      </>
   );
}
