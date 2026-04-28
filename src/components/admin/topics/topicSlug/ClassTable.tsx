"use client";

import { FolderEdit, Trash2, CalendarDays, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { ClassesTableRowsShimmer } from '@/components/admin/topics/topicSlug/ClassesTableShimmer';
import { ClassTableProps } from '@/types/admin/class.types';

export default function ClassTable({ classesList, loading, search, topicSlug, onEdit, onDelete, onViewQuestions }: ClassTableProps) {
   const filteredClasses = classesList.filter(c => c.class_name.toLowerCase().includes(search.toLowerCase()));

   return (
      <div className="p-4 rounded-2xl glass backdrop-blur-2xl shadow-sm mb-5 overflow-hidden">

         <div className="overflow-x-auto ">
            <Table >
               <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                     <TableHead>Overview</TableHead>
                     <TableHead>Class Date</TableHead>
                     <TableHead className="text-center">Questions</TableHead>
                     <TableHead className="text-center">Resources</TableHead>
                     <TableHead className="text-right"></TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {loading ? (
                     <ClassesTableRowsShimmer />
                  ) : filteredClasses.length === 0 ? (
                     <TableRow>
                        <TableCell colSpan={5} className="h-48 text-center text-muted-foreground">
                           No classes mapped to this batch and topic yet.
                        </TableCell>
                     </TableRow>
                  ) : (
                     filteredClasses.map((cls) => (
                        <TableRow
                           key={cls.id}
                           className=" hover:bg-muted/30 cursor-pointer transition-colors"
                           onClick={() => onViewQuestions(cls)}
                        >
                           <TableCell>
                              <div className="font-semibold  text-foreground text-base">{cls.class_name}</div>
                             
                           </TableCell>
                           <TableCell>
                              <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                                 {cls.class_date ? new Date(cls.class_date).toLocaleDateString() : 'N/A'}
                              </div>
                           </TableCell>
                           <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                 <span className="inline-flex items-center justify-center bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-2xl text-sm">
                                    {cls.questionCount || 0}
                                 </span>
                              </div>
                           </TableCell>
                           <TableCell className="text-center">
                              {cls.pdf_url ? (
                                 <a href={cls.pdf_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-colors font-medium px-2.5 py-1 rounded-2xl text-xs gap-1.5 max-w-[120px] truncate" title={cls.pdf_url}>
                                    <LinkIcon className="w-3 h-3 shrink-0" /> Open Notes
                                 </a>
                              ) : (
                                 <span className="text-muted-foreground text-xs italic">No Attachments</span>
                              )}
                           </TableCell>
                           <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                 <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1.5 font-medium bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30 text-primary"
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       onViewQuestions(cls);
                                    }}
                                 >
                                    View Questions
                                 </Button>
                                 <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       onEdit(cls);
                                    }}
                                    className="h-8 w-8 hover:bg-muted border-border/50"
                                 >
                                    <FolderEdit className="w-4 h-4 text-muted-foreground" />
                                 </Button>
                                 <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       onDelete(cls);
                                    }}
                                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive border-border/50"
                                 >
                                    <Trash2 className="w-4 h-4 opacity-70" />
                                 </Button>
                              </div>
                           </TableCell>
                        </TableRow>
                     ))
                  )}
               </TableBody>
            </Table>
         </div>
      </div>
   );
}
