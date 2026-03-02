// src/components/ui/QRCodeBox.tsx
interface QRCodeBoxProps {
    bookingId: string;
}

// Generate a simple SVG QR-code-like pattern based on bookingId hash
function pseudoQRPattern(id: string): boolean[][] {
    const seed = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const size = 15;
    const grid: boolean[][] = [];

    // Always-on finder patterns
    const finderPositions = new Set<string>();
    [[0, 0], [0, size - 7], [size - 7, 0]].forEach(([r, c]) => {
        for (let dr = 0; dr < 7; dr++) {
            for (let dc = 0; dc < 7; dc++) {
                const inBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6;
                const inInner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
                if (inBorder || inInner) finderPositions.add(`${r + dr},${c + dc}`);
            }
        }
    });

    for (let r = 0; r < size; r++) {
        grid[r] = [];
        for (let c = 0; c < size; c++) {
            if (finderPositions.has(`${r},${c}`)) {
                grid[r][c] = true;
            } else {
                const val = (seed * (r + 1) * 31 + c * 17 + r * 7) % 101;
                grid[r][c] = val > 44;
            }
        }
    }

    return grid;
}

export default function QRCodeBox({ bookingId }: QRCodeBoxProps) {
    const grid = pseudoQRPattern(bookingId);
    const cellSize = 10;
    const size = grid.length;
    const svgSize = size * cellSize;

    return (
        <div
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '0.75rem',
            }}
            aria-label={`QR code for booking ${bookingId}`}
        >
            <div style={{
                background: 'white',
                padding: '12px',
                borderRadius: '0.75rem',
                display: 'inline-block',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}>
                <svg
                    width={svgSize}
                    height={svgSize}
                    viewBox={`0 0 ${svgSize} ${svgSize}`}
                    role="img"
                    aria-label="QR Code"
                >
                    {grid.map((row, r) =>
                        row.map((cell, c) =>
                            cell ? (
                                <rect
                                    key={`${r}-${c}`}
                                    x={c * cellSize}
                                    y={r * cellSize}
                                    width={cellSize}
                                    height={cellSize}
                                    fill="#0f172a"
                                />
                            ) : null
                        )
                    )}
                </svg>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>
                Scan to check in · {bookingId}
            </span>
        </div>
    );
}
