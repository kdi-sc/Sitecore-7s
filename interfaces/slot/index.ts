export interface SlotsList {
    slot1: Slot
    slot2: Slot
    slot3: Slot
  }
  
  export interface Slot {
    contentID: string
    contentIDsList: []
    decisionName: string
    decisionDescription: string
    name: string
  }