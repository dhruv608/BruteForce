"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HelpCircle, Trophy, Calculator, BarChart3, Flame, Scale3D, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EvaluationModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full  hover:opacity-100 transition-opacity">
          <HelpCircle className="w-5! h-5! text-muted-foreground hover:text-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className=" h-[90vh]  overflow-hidden max-w-2xl! p-2 rounded-2xl">
        <DialogHeader className="p-4 h-15!  border-b border-border">
          <DialogTitle className="text-2xl  font-bold flex items-center gap-2">
            Evaluation <span className='text-primary'>Logic</span>
          </DialogTitle>
        </DialogHeader>
        <div className="h-full p-6 overflow-y-auto" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          alignContent: 'start'
        }}>

          <div className="space-y-6">
            {/* Ranking System */}
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                Ranking System
              </h4>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong className="text-foreground">Global Rank:</strong> Overall ranking across all cities based on total score.</li>
                <li><strong className="text-foreground">City Rank:</strong> Ranking within your city only, filtered by city selection.</li>
                <li><strong className="text-foreground">Dynamic Display:</strong> Shows "Global Rank" when "All Cities" is selected, otherwise "City Rank".</li>
              </ul>
            </div>

            {/* Score Calculation */}
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                Score 
              </h4>
              <div className="bg-muted/50 p-4 rounded-lg mt-3">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="flex flex-col items-center">
                    <div className="font-bold text-easy">Easy</div>
                    <div className="text-xs text-muted-foreground">10 points</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="font-bold text-medium">Medium</div>
                    <div className="text-xs text-muted-foreground">15 points</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="font-bold text-hard">Hard</div>
                    <div className="text-xs text-muted-foreground">20 points</div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground/80">Only accepted submissions count toward score.</p>
            </div>

            {/* Tie Breaking Rules */}
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Scale3D className="w-4 h-4 text-primary" />
                Tie-Breaking Rules
              </h4>
              <p className="text-sm text-muted-foreground mb-3">When students have the same score, ranking is determined by:</p>
              <ol className="list-decimal pl-5 mt-3 space-y-2 text-sm">
                <li><strong className="text-foreground">Higher Score:</strong> Primary ranking criterion</li>
                <li><strong className="text-foreground">More Problems Solved:</strong> If scores are equal</li>
                <li><strong className="text-foreground">Higher Difficulty Solved:</strong> Prioritizes hard over medium over easy</li>
                <li><strong className="text-foreground">Longer Active Streak:</strong> Current consecutive days</li>
                <li><strong className="text-foreground">Earlier Achievement:</strong> Who reached to score first</li>
              </ol>
            </div>

           
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
