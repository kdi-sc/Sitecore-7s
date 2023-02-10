export interface Seven {
    id: string
    title: string
    description: string
    media: string
    image: string
  }

  export interface AllSevensResponse {
    data: {
      allSitecoreseven: {
        results: Partial<Seven>[];
      };
    };
  }
  
  export interface SevenResponse {
    data: {
      sitecoreseven: Partial<Seven>;
    };
  }