import { AcknowledgeJobRequest, AcknowledgeJobResponse, JobsServiceController, JobsServiceControllerMethods } from '@app/grpc';
import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { JobsService } from '../services/jobs.service';

@Controller()
@JobsServiceControllerMethods()
export class JobsController implements JobsServiceController {

    constructor(private readonly jobsService: JobsService) { }

    acknowledge(request: AcknowledgeJobRequest): Promise<AcknowledgeJobResponse> | Observable<AcknowledgeJobResponse> | AcknowledgeJobResponse {
        return this.jobsService.acknowledge(request.jobId);
    }
}
