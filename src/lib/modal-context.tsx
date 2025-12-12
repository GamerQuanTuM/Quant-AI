'use client'

import React, { createContext, useContext, useState } from 'react'

interface ModalContextType {
    isCreateProjectOpen: boolean
    openCreateProject: () => void
    closeCreateProject: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)

    const openCreateProject = () => setIsCreateProjectOpen(true)
    const closeCreateProject = () => setIsCreateProjectOpen(false)

    return (
        <ModalContext.Provider value={{ isCreateProjectOpen, openCreateProject, closeCreateProject }}>
            {children}
        </ModalContext.Provider>
    )
}

export function useModal() {
    const context = useContext(ModalContext)
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider')
    }
    return context
}
