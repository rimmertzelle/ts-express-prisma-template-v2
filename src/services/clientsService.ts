import clientsRepository from '../repositories/clientsRepository.js';
import type { Client } from '../types/client.js';
import type { ClientDto } from '../dtos/clientDto.js';
import { toClientDto, toClientDtos } from '../mappers/clientMapper.js';
import { NotFoundError } from '../errors/httpErrors.js';

/**
 * Service layer that contains business logic for Clients.
 * Uses the repository for data access and maps entities to DTOs.
 */
export class ClientsService {
	/**
	 * List all clients and map them to DTOs.
	 * @returns Promise resolving to an array of ClientDto
	 */
	async listClients(): Promise<ClientDto[]> {
	 const clients: Client[] = await clientsRepository.findAll();
	 return toClientDtos(clients);
	}

	/**
	 * Get a single client by id and map to DTO.
	 * @param id Client id
	 * @throws NotFoundError when client does not exist
	 * @returns Promise resolving to a ClientDto
	 */
	async getClientById(id: number): Promise<ClientDto> {
		const client = await clientsRepository.findById(id);
		if (!client) {
			throw new NotFoundError('Client not found');
		}
		return toClientDto(client);
	}
}

export default new ClientsService();


