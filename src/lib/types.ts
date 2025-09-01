export type Note = {
  title: string;
  content: string;
  editable: boolean;
};

export type SelectedDoc = {
  id: number;
  name: string;
  uniqueId: string;
  viewpath: string;
};

// an array of docs
export type SelectedDocs = SelectedDoc[];

// individual document inside a module
export interface DocumentData {
  id: number;
  name: string;
  mapping: string;
  source: string;
  chapter: string;
  viewpath: string | null;
}

// module that contains documents
export interface ModuleData {
  name: string;
  documents: DocumentData[];
  course: string;
}

// top-level object
export interface CardData {
  title: string;
  modules: ModuleData[];
}
