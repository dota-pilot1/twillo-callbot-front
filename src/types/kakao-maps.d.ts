export {};

declare global {
  type KakaoLatLng = {
    getLat(): number;
    getLng(): number;
  };

  type KakaoMap = {
    setCenter(position: KakaoLatLng): void;
    setLevel(level: number): void;
    addControl(control: unknown, position: number): void;
  };

  type KakaoOverlay = {
    setMap(map: KakaoMap | null): void;
  };

  type KakaoMarker = KakaoOverlay;

  type KakaoInfoWindow = KakaoOverlay & {
    open(map: KakaoMap, marker?: KakaoMarker): void;
    close(): void;
  };

  type KakaoSize = unknown;

  type KakaoPoint = unknown;

  type KakaoMarkerImage = unknown;

  type KakaoMapsNamespace = {
    load(callback: () => void): void;
    LatLng: new (lat: number, lng: number) => KakaoLatLng;
    Size: new (width: number, height: number) => KakaoSize;
    Point: new (x: number, y: number) => KakaoPoint;
    MarkerImage: new (
      src: string,
      size: KakaoSize,
      options?: { offset?: KakaoPoint }
    ) => KakaoMarkerImage;
    Map: new (
      container: HTMLElement,
      options: { center: KakaoLatLng; level: number }
    ) => KakaoMap;
    Marker: new (options: {
      map?: KakaoMap | null;
      position: KakaoLatLng;
      title?: string;
      image?: KakaoMarkerImage;
    }) => KakaoMarker;
    InfoWindow: new (options: {
      content: string;
      removable?: boolean;
    }) => KakaoInfoWindow;
    MapTypeControl: new () => unknown;
    ZoomControl: new () => unknown;
    ControlPosition: {
      TOPRIGHT: number;
      RIGHT: number;
    };
  };

  interface Window {
    kakao?: {
      maps: KakaoMapsNamespace;
    };
  }
}
