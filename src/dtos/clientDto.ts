/**
 * Shape returned to API consumers for a Client resource.
 * Dates are serialized as ISO strings.
 */
export interface ClientDto {
	id: number;
	createdAt: string;
	name: string | null;
	email: string;
}

export default ClientDto;


