import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import type { AffectedShipment } from '../../types/merchant';

interface AffectedShipmentsPreviewProps {
  shipments: AffectedShipment[];
}

const carrierColors: Record<string, { bg: string; color: string }> = {
  'DHL Express': { bg: '#FFCC00', color: '#D40511' },
  'FedEx': { bg: '#4D148C', color: '#FF6600' },
  'GLS': { bg: '#003580', color: '#FED530' },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function AffectedShipmentsPreview({ shipments }: AffectedShipmentsPreviewProps) {
  return (
    <Box>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827', mb: 1.5 }}>
        Affected Shipments ({shipments.length})
      </Typography>
      <Box sx={{ border: '1px solid #e8ebf0', borderRadius: 1.5, overflow: 'hidden' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Shipment #</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Carrier</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell align="right">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.map(s => {
              const cc = carrierColors[s.carrier] || { bg: '#f3f4f6', color: '#6b7280' };
              return (
                <TableRow key={s.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 500, fontFamily: 'monospace' }}>
                      {s.shipmentNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 12.5, color: '#6b7280' }}>{formatDate(s.date)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={s.carrier}
                      size="small"
                      sx={{ bgcolor: cc.bg, color: cc.color, fontWeight: 600, fontSize: 10.5, height: 20, border: 'none' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 12.5, color: '#6b7280' }}>{s.destination}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontSize: 12.5, fontWeight: 500 }}>€{s.valueEur.toFixed(2)}</Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
