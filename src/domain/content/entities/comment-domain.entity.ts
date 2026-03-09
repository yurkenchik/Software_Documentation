import { AuditedDomainEntity } from '../../../shared/entities/audited-domain.entity';
import { CommentStatus } from '@domain/content/enums/comment-status.enum';

export class CommentDomainEntity extends AuditedDomainEntity {
    public readonly postId: string;
    public readonly authorName: string;
    public readonly body: string;
    private _status: CommentStatus;

    constructor(
        id: string,
        postId: string,
        authorName: string,
        body: string,
        createdAt: Date,
        updatedAt: Date,
        status: CommentStatus,
    ) {
        super(id, createdAt, updatedAt);
        this.postId = postId;
        this.authorName = authorName;
        this.body = body;
        this._status = status;
    }

    getStatus(): CommentStatus {
        return this._status;
    }

    approve(updatedAt: Date): void {
        this._status = CommentStatus.Approved;
        this.touch(updatedAt);
    }

    reject(updatedAt: Date): void {
        this._status = CommentStatus.Rejected;
        this.touch(updatedAt);
    }
}
