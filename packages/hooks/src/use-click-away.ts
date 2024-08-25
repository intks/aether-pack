import { useEffect, useCallback, RefObject } from "react";

type EventType = MouseEvent | TouchEvent;
type Handler = (event: EventType) => void;

const eventNames: (keyof DocumentEventMap)[] = ["mousedown", "touchstart"];

/**
 * Attaches a click-away event listener to the specified element reference.
 * The provided handler function will be called when a click event occurs outside of the element.
 *
 * @template T - The type of the element reference.
 * @param {RefObject<T>} ref - The element reference to attach the click-away event listener to.
 * @param {Handler} handler - The handler function to be called when a click event occurs outside of the element.
 * @param {boolean} [enabled=true] - Determines whether the click-away event listener is enabled or not.
 * @returns {void}
 */
const useClickAway = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler,
  enabled: boolean = true
): void => {
  const handleClickAway = useCallback(
    (event: EventType) => {
      const el = ref.current;
      if (!el || !enabled) return;
      if (el.contains(event.target as Node)) return;
      handler(event);
    },
    [ref, handler, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    const doc = ref.current?.ownerDocument || document;

    const addEventListeners = () => {
      eventNames.forEach((eventName) => {
        doc.addEventListener(eventName, handleClickAway as EventListener, true);
      });
    };

    const removeEventListeners = () => {
      eventNames.forEach((eventName) => {
        doc.removeEventListener(
          eventName,
          handleClickAway as EventListener,
          true
        );
      });
    };

    addEventListeners();

    return removeEventListeners;
  }, [ref, handleClickAway, enabled]);
};

export default useClickAway;
