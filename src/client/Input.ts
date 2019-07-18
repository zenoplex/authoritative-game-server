export class Input {
  private element: Window | Document | HTMLElement | null = null;
  public up: boolean = false;
  public down: boolean = false;
  public right: boolean = false;
  public left: boolean = false;

  public constructor(element: Window | Document | HTMLElement) {
    this.element = element;
    this.addEventListeners(element);
  }

  public destroy = () => {
    if (!this.element) return;
    this.removeEventListeners(this.element);
    this.element = null;
  };

  private addEventListeners = (element: Window | Document | HTMLElement) => {
    (element as HTMLElement).addEventListener('keydown', this.handleKeyDown);
    (element as HTMLElement).addEventListener('keyup', this.handleKeyUp);
  };

  private removeEventListeners = (element: Window | Document | HTMLElement) => {
    (element as HTMLElement).removeEventListener('keydown', this.handleKeyDown);
    (element as HTMLElement).removeEventListener('keyup', this.handleKeyUp);
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    switch (e.keyCode) {
      case 37:
      case 65:
      case 97:
        this.left = true;
        break;
      case 38:
      case 87:
      case 199:
        this.up = true;
        break;
      case 39:
      case 68:
      case 100:
        this.right = true;
        break;
      case 40:
      case 83:
      case 115:
        this.down = true;
        break;
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    switch (e.keyCode) {
      case 37:
      case 65:
      case 97:
        this.left = false;
        break;
      case 38:
      case 87:
      case 199:
        this.up = false;
        break;
      case 39:
      case 68:
      case 100:
        this.right = false;
        break;
      case 40:
      case 83:
      case 115:
        this.down = false;
        break;
    }
  };
}
