import { Component, OnInit} from '@angular/core';
import { WebsocketService } from '../../providers/websocket.service';
import { NotificationService } from '../../providers/notification.service';
import {ElectronService} from 'ngx-electron';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ WebsocketService, NotificationService]
})
export class HomeComponent implements OnInit {
  authorpush: string;
  messagepush: string;

  constructor(private notifService: NotificationService, private _electronService: ElectronService) {
    notifService.messages.subscribe(msg => {
      this.messagepush = msg.message;
      this.authorpush = msg.author;
      console.log("Response from websocket: " + msg);
      let pong: string = this._electronService.ipcRenderer.sendSync('beacon', msg);
    });
  }

  public playPingPong() {
    if(this._electronService.isElectronApp) {
      let pong: string = this._electronService.ipcRenderer.sendSync('beacon');
      console.log(pong);
    }
  }

  ngOnInit() {
  }

  private message = {
    author: 'author',
    message: 'message'
  }


  sendMsg = () => {
    this.message.message = this.messagepush;
    this.message.author = this.authorpush
    console.log('new message from client to websocket: ', this.message);
    this.notifService.messages.next(this.message);
    this.message.message = '';
  }

}
