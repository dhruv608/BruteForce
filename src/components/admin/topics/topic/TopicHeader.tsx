"use client";

interface TopicHeaderProps {
   totalRecords: number;
}

export default function TopicHeader({ totalRecords }: TopicHeaderProps) {
   return (
      <div className="glass backdrop-blur-2xl rounded-2xl p-6 mb-5 -mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">

         <div className="flex items-center gap-4">


            <div>
               <h2 className="text-3xl font-semibold text-foreground">
                  Topic <span className="text-primary ">Curriculum</span>
               </h2>
               <p className='p-0 m-0 mt-1 text-sm text-muted-foreground '>Admin dashboard to manage topics, classes, and questions with structured curriculum control.</p>
            </div>
         </div>

         {/* RIGHT BADGE */}
         <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mt-3 sm:mt-0 w-full sm:w-auto text-center sm:text-left">
            {totalRecords} Topics
         </div>

      </div>
   );
}
