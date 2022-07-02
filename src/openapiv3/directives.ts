// REST

export interface PathDirective {
  value: string;
}

export interface ResponseDirective {
  status: string;
  returns?: string;
  description?: string;
  examples?: { [k: string]: string };
}

// OpenAPI v2

export interface HostDirective {
  value: string;
}

export interface SchemesDirective {
  value: string[];
}

export interface ConsumesDirective {
  value: string[];
}

export interface ProducesDirective {
  value: string[];
}

export interface SummaryDirective {
  value: string;
}

// OpenAPI v3

export interface ServerDirective {
  url: string;
  description?: string;
}
