import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * DraggableScreenshotPreview Component
 * A draggable, resizable screenshot preview with fullscreen capability
 */
const DraggableScreenshotPreview = ({
    preview,
    onClose,
    isWaiting = false,
    type = 'invite', // 'invite' or 'remove'
    initialPosition = { x: null, y: null } // null means use default position
}) => {
    const containerRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [size, setSize] = useState({ width: 320, height: 'auto' });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [initialized, setInitialized] = useState(false);

    const isInvite = type === 'invite';
    const gradientStyle = isInvite
        ? 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%)'
        : 'linear-gradient(135deg, var(--error) 0%, var(--error-light) 100%)';
    const accentColor = isInvite ? 'var(--accent-purple)' : 'var(--error)';

    // Initialize position on mount
    useEffect(() => {
        if (!initialized && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            if (initialPosition.x !== null && initialPosition.y !== null) {
                setPosition(initialPosition);
            } else {
                // Default: bottom right for invite, bottom left for remove
                const defaultX = isInvite
                    ? window.innerWidth - rect.width - 16
                    : 16;
                const defaultY = window.innerHeight - rect.height - 16;
                setPosition({ x: defaultX, y: defaultY });
            }
            setInitialized(true);
        }
    }, [initialized, initialPosition, isInvite]);

    // Handle drag start
    const handleDragStart = useCallback((e) => {
        if (isFullscreen) return;
        e.preventDefault();
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        setDragOffset({
            x: clientX - position.x,
            y: clientY - position.y
        });
        setIsDragging(true);
    }, [position, isFullscreen]);

    // Handle drag move
    const handleDragMove = useCallback((e) => {
        if (!isDragging) return;
        e.preventDefault();
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        const newX = Math.max(0, Math.min(window.innerWidth - size.width, clientX - dragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 100, clientY - dragOffset.y));

        setPosition({ x: newX, y: newY });
    }, [isDragging, dragOffset, size.width]);

    // Handle drag end
    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Handle resize start
    const handleResizeStart = useCallback((e) => {
        if (isFullscreen) return;
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
    }, [isFullscreen]);

    // Handle resize move
    const handleResizeMove = useCallback((e) => {
        if (!isResizing) return;
        e.preventDefault();
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;

        const newWidth = Math.max(250, Math.min(600, clientX - position.x));
        setSize(prev => ({ ...prev, width: newWidth }));
    }, [isResizing, position.x]);

    // Handle resize end
    const handleResizeEnd = useCallback(() => {
        setIsResizing(false);
    }, []);

    // Add/remove event listeners
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleDragMove);
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchmove', handleDragMove);
            window.addEventListener('touchend', handleDragEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, [isDragging, handleDragMove, handleDragEnd]);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleResizeMove);
            window.addEventListener('mouseup', handleResizeEnd);
            window.addEventListener('touchmove', handleResizeMove);
            window.addEventListener('touchend', handleResizeEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleResizeMove);
            window.removeEventListener('mouseup', handleResizeEnd);
            window.removeEventListener('touchmove', handleResizeMove);
            window.removeEventListener('touchend', handleResizeEnd);
        };
    }, [isResizing, handleResizeMove, handleResizeEnd]);

    // Toggle fullscreen
    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    // Open in new tab
    const openInNewTab = () => {
        const newWindow = window.open();
        newWindow.document.write(`
      <html>
        <head><title>Screenshot - ${preview.gptAccount}</title></head>
        <body style="margin:0;background:#1f2937;display:flex;justify-content:center;align-items:center;min-height:100vh;">
          <img src="data:image/png;base64,${preview.image}" style="max-width:100%;height:auto;"/>
        </body>
      </html>
    `);
    };

    if (!preview) return null;

    const memberLabel = isInvite ? 'Member' : 'Removing';
    const memberEmail = isInvite ? preview.memberEmail : preview.email;

    return (
        <>
            {/* Fullscreen Overlay */}
            {isFullscreen && (
                <div
                    className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
                    onClick={() => setIsFullscreen(false)}
                >
                    <div className="relative max-w-full max-h-full">
                        <img
                            src={`data:image/png;base64,${preview.image}`}
                            alt="Screenshot Fullscreen"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="absolute top-4 right-4 p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
                            <p className="text-sm font-medium">{preview.gptAccount}</p>
                            <p className="text-xs text-white/70">{memberLabel}: {memberEmail}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Draggable Preview */}
            {!isFullscreen && (
                <div
                    ref={containerRef}
                    className="fixed z-50 animate-slide-in-right select-none"
                    style={{
                        left: initialized ? position.x : (isInvite ? 'auto' : 16),
                        right: initialized ? 'auto' : (isInvite ? 16 : 'auto'),
                        top: initialized ? position.y : 'auto',
                        bottom: initialized ? 'auto' : 16,
                        width: size.width,
                        cursor: isDragging ? 'grabbing' : 'default'
                    }}
                >
                    <div
                        className="rounded-2xl shadow-2xl overflow-hidden"
                        style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)'
                        }}
                    >
                        {/* Header - Draggable */}
                        <div
                            className="px-4 py-3 flex items-center justify-between cursor-grab active:cursor-grabbing"
                            style={{ background: gradientStyle }}
                            onMouseDown={handleDragStart}
                            onTouchStart={handleDragStart}
                        >
                            <div className="text-white flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-white/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                    </svg>
                                    <p className="text-sm font-bold truncate">Screenshot Preview</p>
                                </div>
                                <p className="text-xs text-white/80 truncate mt-0.5">
                                    {preview.gptAccount}
                                </p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                                {/* Expand Button */}
                                <button
                                    onClick={toggleFullscreen}
                                    className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                                    title="Fullscreen"
                                >
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                </button>
                                {/* Open in new tab */}
                                <button
                                    onClick={openInNewTab}
                                    className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                                    title="Open in new tab"
                                >
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </button>
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                                    title="Close"
                                >
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Screenshot Image */}
                        <div className="p-2 relative">
                            <img
                                src={`data:image/png;base64,${preview.image}`}
                                alt="Screenshot Preview"
                                className="w-full h-auto rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                                style={{ borderColor: 'var(--border-subtle)' }}
                                onClick={toggleFullscreen}
                            />
                        </div>

                        {/* Info + Waiting Indicator */}
                        <div
                            className="px-4 py-2 border-t"
                            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
                        >
                            <p className="text-xs text-[var(--text-secondary)] truncate">
                                <span className="font-medium">{memberLabel}:</span> {memberEmail}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-[var(--text-tertiary)]">
                                    {new Date(preview.timestamp).toLocaleTimeString()}
                                </p>
                                {isWaiting && (
                                    <div className="flex items-center gap-1.5">
                                        <div
                                            className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin"
                                            style={{ borderColor: accentColor, borderTopColor: 'transparent' }}
                                        ></div>
                                        <span className="text-xs font-medium" style={{ color: accentColor }}>Waiting...</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Resize Handle */}
                        <div
                            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
                            style={{
                                background: 'linear-gradient(135deg, transparent 50%, var(--border-default) 50%)',
                                borderBottomRightRadius: '1rem'
                            }}
                            onMouseDown={handleResizeStart}
                            onTouchStart={handleResizeStart}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default DraggableScreenshotPreview;
