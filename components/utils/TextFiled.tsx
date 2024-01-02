import { ChangeEventHandler, Dispatch, ForwardedRef, HTMLProps, KeyboardEvent, ReactNode, SetStateAction, forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import { IconType } from "react-icons";

export interface IValidate {
    validate: (str: string) => boolean;
    massage: string
}

interface TextFiledProps {
    label: string
    value: string
    setValue: Dispatch<SetStateAction<string>>
    validation?: IValidate[];
    icon?: IconType
    InElement?: ReactNode
    inputProps?: HTMLProps<HTMLInputElement>
    onFocus?: () => void
    onBlur?: () => void
    maxLength?: number
    small?: boolean
    className?: string
}


const TextFiled = forwardRef((props: TextFiledProps, ref: ForwardedRef<HTMLDivElement>) => {
    const Id = useId();
    const [isFocus, setIsFocus] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMassage, setErrorMassage] = useState("");
    const inputRef = useRef<HTMLInputElement>(null)

    const labelClassName = useMemo(() => {
        if (props.value) return "sr-only"
        else return `absolute z-10 font-extralight transition-all ease-in-out
        ${isFocus ? `bottom-[95%] ${props?.icon ? "left-[12%]" : "left-[2.4%]"} text-sm ${isError ? "dark:text-red-400 text-red-600" : "dark:text-secondary text-primary"}`
         : `text-base ${props?.icon ? "left-[20%]" : "left-[4%]"} bottom-[20%] text-gray-700 dark:text-gray-200`}`
    }, [props.value, props?.icon, isError, isFocus])

    useEffect(() => {
        inputRef.current?.setCustomValidity(errorMassage)
    }, [errorMassage])

    const onFocus = () => {
        setIsFocus(true)
        if (props?.onFocus) props.onFocus();
    }

    const onBlur = () => {
        setIsFocus(false);
        if (props?.onBlur) props.onBlur();
    }

    const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setValue(e.target.value)
        setIsFocus(true)
        setIsError(false)
    }

    useEffect(() => {
        if (!props?.validation) return;
        let massage = "";
        for (let i = 0; i < props.validation.length; i++) {
            const item = props.validation[i];
            if (!item.validate(props.value)) {
                massage = item.massage
                setIsError(true);
                break;
            }
        }
        setErrorMassage(massage)
    }, [props.validation, props.value])

    const handelKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        e.key === "Enter" && e.preventDefault()
    }

    return (
        <div ref={ref} className={`flex flex-col justify-center items-center ${props.small ? "p-1 px-3" : "p-2 px-6"} w-full gap-2 ${props.className || ""}`}>
            <div className="flex flex-row gap-2 w-full justify-center items-center relative">
                <label
                    htmlFor={Id}
                    className={labelClassName}>
                    {props.label}
                </label>
                {!props?.icon ? null : <props.icon className="text-secondary text-2xl font-bold" />}
                {!props?.InElement ? null : props.InElement}
                <input
                    ref={inputRef}
                    onKeyDown={props.inputProps?.onKeyDown || handelKeyDown}
                    {...props.inputProps}
                    className={`${props.small ? "p-1" : "p-2"} text-secondary bg-normal border h-fit rounded-sm w-full focus:border-none focus:outline-solid focus:outline-2 ${(isError && isFocus) ? "border-red-600 hover:border-red-800 dark:border-red-400 dark:hover:border-red-500 focus:outline-red-600 dark:focus:outline-red-400" : "dark:border-gray-300 dark:hover:border-white border-gray-700 hover:border-gray-900 focus:outline-secondary"}`}
                    id={Id}
                    value={props.value}
                    onFocus={() => onFocus()}
                    onBlur={() => onBlur()}
                    onChange={(e) => handelChange(e)}
                    maxLength={props.maxLength}
                />
            </div>
        </div>
    )
})

TextFiled.displayName = 'TextFiled';

export default TextFiled;
