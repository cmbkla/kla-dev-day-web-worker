import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { v4 as uuid } from "uuid";
import { CrossTabMessage } from "../models/cross-tab-message.model";

@Injectable()
export class CrossTabRelayService {
  protected instanceId: string = uuid();
  protected channel: BroadcastChannel = new BroadcastChannel("cross-tab-relay");
  public relayStream: Subject<CrossTabMessage> = new Subject<CrossTabMessage>();

  public constructor(
  ) {
    this.channel.onmessage = (e) => {
      if (!e.data) {
        return;
      }

      const payload: CrossTabMessage = e.data;
      if (!payload?.originatingInstance || payload?.originatingInstance === this.instanceId) {
        return;
      }

      this.relayStream.next(e.data);
    };
  }

  public relay(type: string, payload?: any): void {
    this.channel.postMessage(<CrossTabMessage>{
      originatingInstance: this.instanceId,
      type: type,
      payload: payload
    });
  }

}
