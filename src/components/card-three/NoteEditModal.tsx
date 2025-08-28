"use client";
import { Edit, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface NoteEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editTitle: string;
  setEditTitle: (title: string) => void;
  editContent: string;
  setEditContent: (content: string) => void;
  isEditable: boolean;
}

const NoteEditModal = ({
  isOpen,
  onClose,
  onSave,
  editTitle,
  setEditTitle,
  editContent,
  setEditContent,
  isEditable,
}: NoteEditModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col bg-card border-border shadow-xl">
        <DialogHeader className="pb-6 border-b border-border">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
            <div className="p-2 rounded-lg bg-primary/10">
              <Edit className="h-5 w-5 text-primary" />
            </div>
            Edit Note
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-2 space-y-6">
          <div className="space-y-3">
            <Label
              htmlFor="note-title"
              className="text-sm font-medium text-foreground flex items-center gap-2"
            >
              <FileText className="h-4 w-4 text-muted-foreground" />
              Title
            </Label>
            <Input
              id="note-title"
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Enter your note title..."
              disabled={!isEditable}
              className="w-full h-12 text-base bg-input border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="note-content"
              className="text-sm font-medium text-foreground"
            >
              Content
            </Label>
            <div className="relative">
              <Textarea
                id="note-content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Start writing your note content here..."
                disabled={!isEditable}
                className="min-h-[320px] resize-none text-base leading-relaxed bg-input border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-muted-foreground"
              />
              {!editContent && (
                <div className="absolute top-12 left-4 text-muted-foreground/60 text-sm pointer-events-none">
                  Share your thoughts, ideas, or important information...
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 pt-6 border-t border-border gap-3 sm:gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 sm:flex-none h-11 px-6 border-border hover:bg-muted transition-colors duration-200 bg-transparent"
          >
            Cancel
          </Button>
          {isEditable && (
            <Button
              onClick={onSave}
              className="flex-1 sm:flex-none h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Save Changes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoteEditModal;
