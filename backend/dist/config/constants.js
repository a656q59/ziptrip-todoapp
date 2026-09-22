"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRIORITY_RANK = exports.SORT_DIRECTIONS = exports.TODO_SORT_FIELDS = exports.TODO_STATUS_FILTERS = exports.TODO_CATEGORIES = exports.TODO_PRIORITIES = exports.MAX_PAGE_SIZE = exports.DEFAULT_PAGE_SIZE = exports.TAG_MAX_COUNT = exports.TAG_MAX_LENGTH = exports.DESCRIPTION_MAX_LENGTH = exports.TITLE_MAX_LENGTH = exports.TITLE_MIN_LENGTH = void 0;
exports.TITLE_MIN_LENGTH = 3;
exports.TITLE_MAX_LENGTH = 120;
exports.DESCRIPTION_MAX_LENGTH = 2000;
exports.TAG_MAX_LENGTH = 24;
exports.TAG_MAX_COUNT = 8;
exports.DEFAULT_PAGE_SIZE = 8;
exports.MAX_PAGE_SIZE = 50;
exports.TODO_PRIORITIES = ['low', 'medium', 'high', 'urgent'];
exports.TODO_CATEGORIES = ['Work', 'Personal', 'Health', 'Learning', 'Home', 'Other'];
exports.TODO_STATUS_FILTERS = ['all', 'active', 'completed'];
exports.TODO_SORT_FIELDS = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'title'];
exports.SORT_DIRECTIONS = ['asc', 'desc'];
exports.PRIORITY_RANK = {
    low: 1,
    medium: 2,
    high: 3,
    urgent: 4,
};
//# sourceMappingURL=constants.js.map