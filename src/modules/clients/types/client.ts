/**
 * Application-facing Client entity shape.
 * Allows optional id/createdAt to support create flows before persistence.
 */
export interface Client {
  id?: string;
  createdAt?: Date;
  name: string | null | undefined;
  email: string;
}

export default Client;
