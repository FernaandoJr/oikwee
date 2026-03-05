import { ObjectId } from 'mongodb';

export function toResponse(doc: Record<string, unknown> & { _id: ObjectId }) {
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}
