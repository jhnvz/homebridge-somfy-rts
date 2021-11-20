import fetch from 'node-fetch';

export default class API {

  private ip: string;
  private id: number;
  private log: any;

  public catchRequestErrors = true;

  constructor(ip: string, id: number, log: any) {
    this.ip = ip;
    this.id = id;
    this.log = log;
  }

  up() {
    this._request('UP');
  }

  down() {
    this._request('DOWN');
  }

  stop() {
    this._request('STOP');
  }

  _request(cmd) {
    const data ={
      remoteId: this.id,
      cmd: cmd,
    };

    fetch(`http://${this.ip}/remote`, {
      method: 'POST',
      body: JSON.stringify(data),
    }).catch(err => this.log.warn(err));
  }

}
