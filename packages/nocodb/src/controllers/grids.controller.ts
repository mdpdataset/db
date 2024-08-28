import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ViewCreateReqType } from 'nocodb-sdk';
import { GlobalGuard } from '~/guards/global/global.guard';
import { GridsService } from '~/services/grids.service';
import { Acl } from '~/middlewares/extract-ids/extract-ids.middleware';
import { MetaApiLimiterGuard } from '~/guards/meta-api-limiter.guard';
import { TenantContext } from '~/decorators/tenant-context.decorator';
import { NcContext, NcRequest } from '~/interface/config';

@Controller()
@UseGuards(MetaApiLimiterGuard, GlobalGuard)
export class GridsController {
  constructor(private readonly gridsService: GridsService) {}

  @Post([
    '/api/v1/db/meta/tables/:tableId/grids/',
    '/api/v2/meta/tables/:tableId/grids/',
  ])
  @HttpCode(200)
  @Acl('gridViewCreate')
  async gridViewCreate(
    @TenantContext() context: NcContext,
    @Param('tableId') tableId: string,
    @Body() body: ViewCreateReqType,
    @Req() req: NcRequest,
  ) {
    const view = await this.gridsService.gridViewCreate(context, {
      grid: body,
      tableId,
      req,
    });
    return view;
  }
  @Patch(['/api/v1/db/meta/grids/:viewId', '/api/v2/meta/grids/:viewId'])
  @Acl('gridViewUpdate')
  async gridViewUpdate(
    @TenantContext() context: NcContext,
    @Param('viewId') viewId: string,
    @Body() body,
    @Req() req: NcRequest,
  ) {
    return await this.gridsService.gridViewUpdate(context, {
      viewId,
      grid: body,
      req,
    });
  }
}
