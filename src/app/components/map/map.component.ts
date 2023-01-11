/* eslint-disable @typescript-eslint/member-ordering */
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { combineLatest, debounceTime } from 'rxjs';
import { LocationService } from '../../services/location.service';
import { StateService } from '../../services/state.service';
import { Direction, GameExit, GameRoom } from '../../types/locations';

type MinimapData = {
  [id: number]: MinimapPosition;
};

type MinimapPosition = {
  left: number;
  bottom: number;
  direction?: Direction;
};

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @ViewChild('map', { static: true })
  public map: ElementRef<HTMLDivElement>;

  public minimapCache = new Set<number>();
  public minimapLoaded = false;

  public renderedLocation = 0;

  public minimapData: MinimapData = {};
  public zoom = 0.7;
  public mapPosition = {
    left: 250,
    bottom: -250,
  };

  constructor(
    private stateService: StateService,
    private locationService: LocationService
  ) {}

  public get showMap(): boolean {
    return this.stateService.showMap;
  }

  public set showMap(value: boolean) {
    this.stateService.showMap = value;
  }

  public get currentRoom(): GameRoom {
    return this.stateService.currentRoom;
  }

  public get scale(): string {
    return `scale(${this.zoom})`;
  }

  public get translate(): string {
    return `translate(${this.mapPosition.left}px, ${this.mapPosition.bottom}px)`;
  }

  public ngOnInit(): void {
    combineLatest([
      this.stateService.currentLocation$,
      this.stateService.currentRoom$,
    ])
      .pipe(debounceTime(200))
      .subscribe(([location, room]) => {
        if (!location || !room) {
          return;
        }

        console.log('location', location);
        console.log('room', room);

        if (this.renderedLocation !== location.id) {
          this.minimapLoaded = false;

          this.minimapCache.clear();
          this.minimapData = {};

          // eslint-disable-next-line no-console
          console.info('Rendering minimap for location');

          this.getMinimapDataForRoom(room.id, null);
          this.renderedLocation = location.id;

          this.minimapLoaded = true;
        }
      });

    this.handleZoom();
    this.handleDrag();
  }

  public getRoom(id: number): GameRoom {
    return this.stateService.currentLocation.rooms.find((x) => x.id === id);
  }

  public goToRoom(id: number): void {
    const exit = this.currentRoom.exits.find((x) => x.roomId === id);

    if (!exit) {
      return;
    }

    this.locationService.move(exit.id);
  }

  public toAnotherLocation(exit: GameExit): void {
    if (!exit) {
      return;
    }

    this.locationService.move(exit.id);
  }

  public getArrowPosition(exit: GameExit): {
    left: string;
    bottom: string;
    transform: string;
  } {
    switch (exit.direction) {
      case 'N':
        return {
          bottom: '105px',
          left: '0',
          transform: 'rotate(-90deg)',
        };
      case 'NE':
        return {
          bottom: '105px',
          left: '90px',
          transform: 'rotate(-45deg)',
        };
      case 'E':
        return {
          bottom: '15px',
          left: '95px',
          transform: 'rotate(0deg)',
        };
      case 'SE':
        return {
          bottom: '-75px',
          left: '90px',
          transform: 'rotate(45deg)',
        };
      case 'S':
        return {
          bottom: '-75px',
          left: '0',
          transform: 'rotate(90deg)',
        };
      case 'SW':
        return {
          bottom: '-75px',
          left: '-90px',
          transform: 'rotate(135deg)',
        };
      case 'W':
        return {
          bottom: '15px',
          left: '-95px',
          transform: 'rotate(180deg)',
        };
      case 'NW':
        return {
          bottom: '105px',
          left: '-90px',
          transform: 'rotate(225deg)',
        };
      default:
        return;
    }
  }

  private handleZoom(): void {
    this.map.nativeElement.addEventListener('wheel', (event) => {
      event.preventDefault();
      if (event.deltaY < 0) {
        if (this.zoom >= 2) {
          return;
        }

        this.zoom += 0.1;
      } else {
        if (this.zoom <= 0.5) {
          return;
        }

        this.zoom -= 0.1;
      }
    });
  }

  private handleDrag(): void {
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    this.map.nativeElement.addEventListener('mousedown', (event) => {
      isDragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
    });

    this.map.nativeElement.addEventListener('mousemove', (event) => {
      if (isDragging) {
        const deltaX = event.clientX - lastX;
        const deltaY = event.clientY - lastY;
        this.mapPosition.left += deltaX * this.zoom;
        this.mapPosition.bottom += deltaY * this.zoom;
        lastX = event.clientX;
        lastY = event.clientY;
      }
    });

    this.map.nativeElement.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  private getMinimapDataForRoom(
    roomId: number,
    roomData: MinimapPosition
  ): void {
    const room = this.getRoom(roomId);

    if (!room) {
      return;
    }

    if (this.minimapCache.has(roomId)) {
      return;
    }

    this.minimapCache.add(roomId);

    if (!roomData) {
      roomData = {
        bottom: 0,
        left: 0,
      };
    }

    this.minimapData[roomId] = roomData;

    room.exits.forEach((exit) => {
      const newRoomData = {
        left: roomData.left,
        bottom: roomData.bottom,
        direction: exit.direction,
      };

      switch (exit.direction) {
        case 'N':
          newRoomData.bottom += 150;
          break;
        case 'NE':
          newRoomData.bottom += 150;
          newRoomData.left += 150;
          break;
        case 'E':
          newRoomData.left += 150;
          break;
        case 'SE':
          newRoomData.left += 150;
          newRoomData.bottom -= 150;
          break;
        case 'S':
          newRoomData.bottom -= 150;
          break;
        case 'SW':
          newRoomData.left -= 150;
          newRoomData.bottom -= 150;
          break;
        case 'W':
          newRoomData.left -= 150;
          break;
        case 'NW':
          newRoomData.bottom += 150;
          newRoomData.left -= 150;
          break;
      }

      this.getMinimapDataForRoom(exit.roomId, newRoomData);
    });
  }
}
