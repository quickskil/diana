declare module 'pg' {
  export interface QueryResultRow {
    [column: string]: unknown;
  }

  export interface QueryResult<T extends QueryResultRow = QueryResultRow> {
    command: string;
    rowCount: number;
    oid: number;
    rows: T[];
    fields: Array<{ name: string }>;
  }

  export interface PoolClient {
    query<T extends QueryResultRow = QueryResultRow>(queryText: string | { text: string; values?: any[] }, values?: any[]): Promise<QueryResult<T>>;
    release(): void;
  }

  export interface PoolConfig {
    connectionString?: string;
    max?: number;
  }

  export class Pool {
    constructor(config?: PoolConfig);
    query<T extends QueryResultRow = QueryResultRow>(queryText: string | { text: string; values?: any[] }, values?: any[]): Promise<QueryResult<T>>;
    connect(): Promise<PoolClient>;
    end(): Promise<void>;
  }
}
