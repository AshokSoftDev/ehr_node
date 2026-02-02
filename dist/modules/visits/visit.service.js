"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitService = void 0;
const visit_repository_1 = require("./visit.repository");
class VisitService {
    constructor() {
        this.repo = new visit_repository_1.VisitRepository();
    }
    list(filters) {
        return this.repo.list(filters);
    }
    getStatusCounts(filters) {
        return this.repo.getStatusCounts(filters);
    }
}
exports.VisitService = VisitService;
