"use client"

import * as React from "react"
import { UploadCloud, CircleAlert } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * FileDrop — Drag-and-drop file upload zone with click-to-browse fallback.
 *
 * @prop title            Main heading text
 * @prop subtitle         Secondary instruction text
 * @prop error            Error message shown below the zone
 * @prop disabled         Mutes the zone, disables all interaction
 * @prop onFilesSelected  Called with the FileList on drop or file input change
 * @prop accept           Passed to the hidden file input (e.g. "image/*,.pdf")
 * @prop multiple         Allow selecting multiple files
 *
 * @example
 * <FileDrop onFilesSelected={(files) => upload(files)} />
 * <FileDrop accept="image/*" error="Only images are allowed." />
 */
function FileDrop({
  title = "Drop files here to add them to module",
  subtitle = "Drag and drop, or click to browse your computer",
  error,
  disabled,
  onFilesSelected,
  accept,
  multiple,
  className,
}: {
  title?: string
  subtitle?: string
  error?: string
  disabled?: boolean
  onFilesSelected?: (files: FileList) => void
  accept?: string
  multiple?: boolean
  className?: string
}) {
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const borderClass = error
    ? "border-[var(--color-error)]"
    : isDragging
      ? "border-[var(--input-border-hover)]"
      : "border-[var(--input-border)]"

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    if (e.dataTransfer.files?.length) onFilesSelected?.(e.dataTransfer.files)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) onFilesSelected?.(e.target.files)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (!disabled) inputRef.current?.click()
    }
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-slot="file-drop"
        className={cn(
          "flex flex-col items-center justify-center gap-6",
          "w-full rounded-2xl bg-white border px-10 py-14",
          "transition-colors duration-150 cursor-pointer select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-info)] focus-visible:ring-offset-2",
          borderClass,
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          hidden
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
        />

        <UploadCloud
          className="w-32 h-32 text-[var(--icon-base)]"
          strokeWidth={1}
          aria-hidden
        />

        <div className="flex flex-col items-center gap-2 w-full">
          <span
            className="text-2xl font-bold text-[var(--icon-base)] text-center leading-tight w-full"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </span>
          <span className="text-base text-[var(--link-text)] text-center leading-relaxed w-full">
            {subtitle}
          </span>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-1">
          <CircleAlert
            className="w-4 h-4 shrink-0 text-[var(--color-error)] mt-0.5"
            aria-hidden
          />
          <span className="text-sm leading-snug text-[var(--color-error)]">
            {error}
          </span>
        </div>
      )}
    </div>
  )
}

export { FileDrop }
