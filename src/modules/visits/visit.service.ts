import { VisitRepository } from './visit.repository';
import { VisitFilters } from './visit.types';

export class VisitService {
  private repo = new VisitRepository();

  list(filters: VisitFilters) {
    return this.repo.list(filters);
  }

  getStatusCounts(filters: { date?: Date; doctorId?: string }) {
    return this.repo.getStatusCounts(filters);
  }
}

