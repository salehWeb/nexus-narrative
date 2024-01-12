import { useState, useCallback, MutableRefObject, useEffect, KeyboardEvent } from "react";
import Heading from "./Heading";
import Bold from "./Bold";
import Italic from "./Italic";
import CodeBlock from "./CodeBlock";
import BlockQuote from "./BlockQuote";
import Link from "./Link";
import CodeLanguage from "./CodeLanguage";
import Image from "./Image";
import UnOrderedList from "./UnOrderedList";
import OrderedList from "./OrderedList";
import useMarkdown from "./useMarkdown";
import Table from "./Table";
import LineBreak from "./LineBreak";
import { TextareaProvider, setRange } from "./util";
import Button from "../Button";
import StrikeThrough from "./StrikeThrough";
import List from "./List";

interface IEditorProps {
    md: string;
    isLoading: boolean;
    files: MutableRefObject<{ base64: string, previewUrl: string }[]>;
    setMd: (md: string) => void;
    onSubmit?: () => void;
    onCancel?: () => void;
}

const Editor = ({ md, setMd, files, onSubmit, onCancel, isLoading }: IEditorProps) => {
    const [isPreview, setIsPreview] = useState(false);
    const [textarea, setTextarea] = useState<HTMLTextAreaElement | null>(null);

    const textareaCallback = useCallback((element: HTMLTextAreaElement | null) => { setTextarea(element) }, [])

    const jsx = useMarkdown(md);

    const autoAdjustHeight = useCallback(() => {
        if (!textarea) return;
        textarea.style.height = "5px";
        textarea.style.height = textarea.scrollHeight + 'px';
    }, [textarea])

    const centerTextareaView = useCallback(() => {
        if (!textarea) return;
        const totalLines = textarea.value.split('\n').length;
        const lineHeight = textarea.scrollHeight / totalLines;
        const cursorLine = textarea.value.substring(0, textarea.selectionStart).split('\n').length;
        const centerPosition = Math.max(cursorLine - Math.floor(textarea.clientHeight / (2 * lineHeight)), 0);

        textarea.scrollTop = centerPosition * lineHeight;
    }, [textarea])

    useEffect(() => {
        autoAdjustHeight();
        centerTextareaView();
    }, [autoAdjustHeight, centerTextareaView, md, textarea])


    const handelKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (textarea == null || e.key !== "Tab") return;
        e.preventDefault();

        const start = textarea.selectionStart;

        setRange(textarea, start)
        document.execCommand("insertText", false, "\t");
        setRange(textarea, start+1)
    }, [textarea])


    return (
        <div className="flex flex-col w-full h-auto border-gray-700 dark:border-gray-300 justify-center items-center ">
            <div className="flex flex-col w-full border-gray-700 dark:border-gray-300 bg-white dark:bg-black p-2 rounded-md">
                <div className="inline-flex w-full justify-between">

                    <div className="flex gap-2 mb-2 mr-8">
                        <Button onClick={() => setIsPreview(!isPreview)}>{isPreview ? "write" : "preview"}</Button>
                    </div>

                    <div className="flex h-auto sm:max-w-[250px] max-w-[200px] relative w-fit items-center">
                        <div className="flex flex-row gap-2 w-full thin-scrollbar overflow-x-auto overflow-y-hidden items-center">
                            {textarea === null ? null : (
                                <TextareaProvider textarea={textarea}>
                                    <Heading />
                                    <Bold />
                                    <Italic />
                                    <List />
                                    <StrikeThrough />
                                    <CodeBlock />
                                    <BlockQuote />
                                    <Link />
                                    <CodeLanguage />
                                    <Image files={files} />
                                    <Table />
                                    <LineBreak />
                                    <UnOrderedList />
                                    <OrderedList />
                                </TextareaProvider>
                            )}
                        </div>
                    </div>
                </div>

                {isPreview ? (
                    <div className="flex flex-col flex-1 flex-grow w-full h-full">{jsx}</div>
                ) : (
                    <div className="inline-flex w-full">
                        <textarea
                            value={md}
                            onChange={(e) => setMd(e.target.value)}
                            ref={textareaCallback}
                            onKeyDown={handelKeyDown}
                            className="border max-h-[65vh] h-auto thin-scrollbar dark:bg-black dark:text-white flex flex-1 flex-grow outline-primary border-primary dark:outline-secondary dark:border-secondary p-2 rounded-md w-full min-h-[20vh]"></textarea>
                    </div>
                )}

                <div className="justify-end mt-2 gap-2 inline-flex w-full">
                    {!onSubmit || isPreview ? null : <Button isLoading={isLoading} onClick={onSubmit}>submit</Button>}
                    {!onCancel ? null : <Button onClick={onCancel}>cancel</Button>}
                </div>

            </div>
        </div>
    )
}

export default Editor;
