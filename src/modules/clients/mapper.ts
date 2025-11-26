import type { Client } from './types/client.js';
import type { ClientDto } from './dtos/clientDto.js';

/**
 * Map an application Client entity to a DTO for API responses.
 */
export function toClientDto(client: Client): ClientDto {
  return {
    id: client.id ?? '',
    createdAt: (client.createdAt ?? new Date(0)).toISOString(),
    name: client.name ?? null,
    email: client.email,
  };
}

/**
 * Map an array of Client entities to DTOs.
 */
export function toClientDtos(clients: Client[]): ClientDto[] {
  return clients.map(toClientDto);
}
