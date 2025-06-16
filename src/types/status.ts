export interface Status {
  id: string;
  name: string;
  stateId: string;
  state?: {
    name: string;
  };
}
