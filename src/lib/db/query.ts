import { ObjectId } from 'mongodb';

/**
 * Universal MongoDB query builder that matches documents by:
 * - ObjectId _id
 * - String _id
 * - String id
 * - String slug (if applicable)
 */
export function buildIdQuery(id: string): any {
  if (!id) return { _id: null };

  // If it's a 24-character hex string that is valid as an ObjectId
  if (ObjectId.isValid(id) && id.length === 24) {
    try {
      return {
        $or: [
          { _id: new ObjectId(id) },
          { _id: id },
          { id: id },
          { slug: id },
        ],
      };
    } catch {
      // fallback if constructor fails
    }
  }

  return {
    $or: [
      { _id: id },
      { id: id },
      { slug: id },
    ],
  };
}
