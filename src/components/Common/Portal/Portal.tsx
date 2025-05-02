import { ReactNode, useEffect, useRef } from "react"
import { createPortal } from "react-dom"

interface PortalProps {
    children: ReactNode
}

export default function Portal({ children }: PortalProps) {
    const elRef = useRef<HTMLDivElement | null>(null)

    if (!elRef.current) {
        const div = document.createElement("div")
        div.className = "my-portal-container"
        elRef.current = div
    }

    useEffect(() => {
        const portalRoot = document.body
        const el = elRef.current
        if (!portalRoot || !el) return

        portalRoot.appendChild(el)
        return () => {
            if (portalRoot.contains(el)) {
                portalRoot.removeChild(el)
            }
        }
    }, [])

    return createPortal(children, elRef.current)
}
