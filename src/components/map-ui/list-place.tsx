import { Listbox, ListboxItem } from "@nextui-org/listbox";
import ListboxWrapper from "../ListboxWrapper";
import { IPlaceData } from "@/models/server-data/place.model";
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

interface Props {
  map: mapboxgl.Map | undefined;
  places: IPlaceData[];
}

const ListPlace = ({ map, places }: Props) => {
  const listWrapRef = useRef<HTMLDivElement | null>(null);

  const virtualizer = useVirtualizer({
    count: places.length,
    getScrollElement: () => listWrapRef.current, // Контейнер для скролу
    estimateSize: () => 55,
  });

  return (
    <div className="w-full h-full flex">
      <ListboxWrapper
        ref={listWrapRef}
        className="pointer-events-auto shadow-2xl m-2 bg-content1 justify-self-end overflow-auto max-w-[200px] hidden sm:block max-h-[calc(100svh-20px)] h-full"
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          <Listbox aria-label="Actions">
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const place = places[virtualRow.index];
              return (
                <ListboxItem
                  key={place.id}
                  value={place.id}
                  description={place.population}
                  onClick={() => {
                    map?.flyTo({
                      center: [place.lon, place.lat],
                      zoom: 12,
                      speed: 1.5,
                      curve: 1,
                      essential: true,
                    });
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="flex gap-1">
                    <span className="text-green-200">
                      {virtualRow.index + 1}.
                    </span>
                    <p>{place.name}</p>
                  </div>
                </ListboxItem>
              );
            })}
          </Listbox>
        </div>
      </ListboxWrapper>
    </div>
  );
};

export default ListPlace;
