import cron from 'node-cron';
import { IFindExpiredSessionUseCase } from '../../application/useCase/video/IFindExpiredSessionUseCase';

export class CheckExpireySession {
    
    constructor(
        private _findExpiredSessionUseCase: IFindExpiredSessionUseCase
    ) {}
    start() {
        cron.schedule('0 0 * * * *', async () => {
            try {
                await this._findExpiredSessionUseCase.execute();
                console.log('[Cron] Successfully processed expired sessions.');
                
            } catch (error) {
                console.error('[Cron Error] Failed to expire sessions:', error);
            }
        });
    }
}
