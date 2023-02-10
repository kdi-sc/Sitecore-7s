export interface Seven {
    id: string
    title: string
    description: string
    media: string
    image: string
  }

  export interface AllSevensResponse {
    data: {
      allSevens: {
        results: Partial<Seven>[];
      };
    };
  }
  
  export interface SevenResponse {
    data: {
      sitecoreseven: Partial<Seven>;
    };
  }