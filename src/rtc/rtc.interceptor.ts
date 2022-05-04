import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { RtcService } from "./rtc.service";
import { IRtcUserInfo, IWsClient } from "../shared/models";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class RtcInterceptor implements NestInterceptor {
  constructor(private readonly rtcService: RtcService) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const client: IWsClient = context.switchToWs().getClient();
    const rtcInfo: IRtcUserInfo = this.rtcService.getInfo(client.conn.id);
    if (!rtcInfo) { // unreachable point
      throw new WsException('not registered user');
    }
    context.switchToWs().getClient().rtcInfo = rtcInfo;
    return next.handle();
  }

}
