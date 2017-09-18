import { Component, OnInit} from '@angular/core';
import { WebsocketService } from '../../providers/websocket.service';
import { NotificationService } from '../../providers/notification.service';
import {ElectronService} from 'ngx-electron';
import { Notification} from '../data/notification';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ WebsocketService, NotificationService]
})
export class HomeComponent implements OnInit {
  authorpush: string;
  messagepush: string;
  notifications: Array<Notification>;
  private notify:  Notification;


  constructor(private notifService: NotificationService, private _electronService: ElectronService) {
    this.notifications = new Array<Notification>();
    notifService.messages.subscribe(msg => {
      this.messagepush = msg.message;
      this.authorpush = msg.author;
      this.notifications.push(msg);
      console.log("Response from websocket: " + this.notifications);
      const pong: string = this._electronService.ipcRenderer.sendSync('beacon', msg);
    });
  }

  public playPingPong() {
    (notifService: NotificationService) => {
      notifService.messages.subscribe(msg => {
        this.messagepush = msg.message;
        this.authorpush = msg.author;
        console.log("Response from websocket: " + msg);
        const pong: string = this._electronService.ipcRenderer.sendSync('beacon', msg);
      });
    }

  }

  ngOnInit() {
  }

  sendMsg = () => {
    this.notify = new Notification(this.authorpush, this.messagepush);
    console.log('new message from client to websocket: ', this.notify);
    this.notifService.messages.next(this.notify);
  }

}
