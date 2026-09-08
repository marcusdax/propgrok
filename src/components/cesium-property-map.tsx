import { useEffect, useRef, useState } from "react";
import type { Entity, Viewer } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { usePropertyStore } from "@/lib/property-store";

type Props = {
  onMapClick: (lat: number, lng: number) => void;
};

export function CesiumPropertyMap({ onMapClick }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const selectedEntityRef = useRef<Entity | null>(null);
  const geofenceEntityRef = useRef<Entity | null>(null);
  const zoneEntitiesRef = useRef<Entity[]>([]);
  const onMapClickRef = useRef(onMapClick);
  const [mapReady, setMapReady] = useState(false);

  const selected = usePropertyStore((s) => s.selected);
  const geofenceMode = usePropertyStore((s) => s.geofenceMode);
  const radius = usePropertyStore((s) => s.geofenceRadiusM);
  const zoneHits = usePropertyStore((s) => s.zoneHits);
  const mapCenter = usePropertyStore((s) => s.mapCenter);

  onMapClickRef.current = onMapClick;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!host.current) return;
      const Cesium = await import("cesium");
      if (cancelled || !host.current) return;

      const viewer = new Cesium.Viewer(host.current, {
        animation: false,
        baseLayerPicker: false,
        baseLayer: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        navigationHelpButton: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        shouldAnimate: false,
      });

      viewer.scene.backgroundColor = Cesium.Color.fromCssColorString("#0c0d0b");
      viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString("#151613");
      viewer.imageryLayers.addImageryProvider(
        new Cesium.OpenStreetMapImageryProvider({ url: "https://tile.openstreetmap.org/" }),
      );
      viewer.cesiumWidget.creditContainer.setAttribute("aria-label", "Cesium and OpenStreetMap attribution");
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(mapCenter.lng, mapCenter.lat, 18000),
      });

      viewer.screenSpaceEventHandler.setInputAction(
        (movement: { position: import("cesium").Cartesian2 }) => {
          const cartesian = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
          if (!cartesian) return;
          const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          onMapClickRef.current(
            Cesium.Math.toDegrees(cartographic.latitude),
            Cesium.Math.toDegrees(cartographic.longitude),
          );
        },
        Cesium.ScreenSpaceEventType.LEFT_CLICK,
      );

      viewerRef.current = viewer;
      setMapReady(true);
    })();

    return () => {
      cancelled = true;
      viewerRef.current?.destroy();
      viewerRef.current = null;
      selectedEntityRef.current = null;
      geofenceEntityRef.current = null;
      zoneEntitiesRef.current = [];
      setMapReady(false);
    };
    // Cesium is initialized once; reactive camera and entity updates are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const Cesium = await import("cesium");
      const viewer = viewerRef.current;
      if (!viewer || cancelled) return;

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(mapCenter.lng, mapCenter.lat, 18000),
        duration: 0.8,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [mapCenter.lat, mapCenter.lng, mapCenter.zoom]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const Cesium = await import("cesium");
      const viewer = viewerRef.current;
      if (!viewer || cancelled) return;

      if (selectedEntityRef.current) viewer.entities.remove(selectedEntityRef.current);
      selectedEntityRef.current = null;
      if (!selected) return;

      selectedEntityRef.current = viewer.entities.add({
        name: selected.address,
        position: Cesium.Cartesian3.fromDegrees(selected.lng, selected.lat, 20),
        point: {
          color: Cesium.Color.fromCssColorString("#8aa07a"),
          outlineColor: Cesium.Color.fromCssColorString("#eceae4"),
          outlineWidth: 2,
          pixelSize: 14,
        },
        label: {
          text: selected.address,
          fillColor: Cesium.Color.fromCssColorString("#eceae4"),
          font: "13px IBM Plex Sans, sans-serif",
          pixelOffset: new Cesium.Cartesian2(0, -24),
          showBackground: true,
          backgroundColor: Cesium.Color.fromCssColorString("#0c0d0b").withAlpha(0.82),
        },
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [selected]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const Cesium = await import("cesium");
      const viewer = viewerRef.current;
      if (!viewer || cancelled) return;

      if (geofenceEntityRef.current) viewer.entities.remove(geofenceEntityRef.current);
      geofenceEntityRef.current = null;
      if (!geofenceMode || !selected) return;

      geofenceEntityRef.current = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(selected.lng, selected.lat),
        ellipse: {
          material: Cesium.Color.fromCssColorString("#8aa07a").withAlpha(0.16),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString("#8aa07a"),
          semiMajorAxis: radius,
          semiMinorAxis: radius,
        },
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [geofenceMode, radius, selected]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const Cesium = await import("cesium");
      const viewer = viewerRef.current;
      if (!viewer || cancelled) return;

      for (const entity of zoneEntitiesRef.current) viewer.entities.remove(entity);
      zoneEntitiesRef.current = zoneHits.map((hit) =>
        viewer.entities.add({
          name: hit.address,
          position: Cesium.Cartesian3.fromDegrees(hit.lng, hit.lat, 10),
          point: {
            color: Cesium.Color.fromCssColorString("#c4b49a"),
            outlineColor: Cesium.Color.fromCssColorString("#eceae4"),
            outlineWidth: 1,
            pixelSize: 8,
          },
        }),
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [zoneHits]);

  return (
    <div className="relative h-full w-full">
      <div ref={host} className="cesium-container absolute inset-0 h-full w-full" />
      {!mapReady && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/80">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
      <div className="absolute bottom-2 left-2 z-[1000] rounded-lg bg-background/90 px-2 py-1.5 text-[11px] text-muted-foreground shadow-lg backdrop-blur-sm">
        Cesium 3D globe
      </div>
    </div>
  );
}