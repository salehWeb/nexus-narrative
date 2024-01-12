import { BiListUl } from "react-icons/bi/index.js";
import { useCallback, useEffect, useRef } from "react";
import { getCurrentLine, setRange, useTextarea } from "./util";

const UnOrderedList = () => {
    let isUnOrderedListMode = useRef(false);

    const textarea = useTextarea();

    const resetState = () => {
        isUnOrderedListMode.current = false;
    }

    const addItem = () => {
        const text = textarea.value;
        const start = textarea.selectionStart;
        const currentLine = getCurrentLine(start, text);

        if (currentLine.split(".")[0][0] !== "-" && isUnOrderedListMode.current) resetState();

        const inner = `${currentLine.length === 0 ? "" : "\n"}- `;

        setRange(textarea, start);
        document.execCommand("insertText", false, inner);
        setRange(textarea, start + inner.length);

        isUnOrderedListMode.current = true;
    };


    const enterUnOrderedListMode = () => {
        addItem();
    }

    const undo = () => {
        const start = textarea.selectionStart;
        setRange(textarea, start);
        document.execCommand("undo");
    }

    const keydownListener = useCallback((e: KeyboardEvent) => {
        if (e.key !== "Enter" || !isUnOrderedListMode.current) return;

        e.preventDefault();
        const text = textarea.value;
        const start = textarea.selectionStart;
        const currentLine = getCurrentLine(start, text);

        if (!currentLine.startsWith("-")) {
            resetState();
            undo();
            return;
        }

        if (currentLine.length > 1) addItem();
        else {
            resetState();
            undo();
        }
    }, []);

    useEffect(() => {
        textarea.addEventListener("keydown", keydownListener);
        return () => textarea.removeEventListener("keydown", keydownListener);
    }, []);

    return (
        <div title="Unordered list" className="flex justify-center items-center" onClick={() => enterUnOrderedListMode()}>
            <BiListUl className="text-gray-700 dark:text-gray-300 dark:hover:bg-slate-800 hover:bg-slate-200 hover:text-primary dark:hover:text-secondary text-xl rounded-sm cursor-pointer" />
        </div>
    );
};

export default UnOrderedList;
