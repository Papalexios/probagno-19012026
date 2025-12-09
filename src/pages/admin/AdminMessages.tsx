import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { el, enUS } from 'date-fns/locale';
import {
  Mail,
  MailOpen,
  Trash2,
  Phone,
  Calendar,
  User,
  MessageSquare,
  Loader2,
  Search,
  Filter,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminMessages() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ContactMessage[];
    },
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      toast.success('Το μήνυμα διαγράφηκε');
      setSelectedMessage(null);
    },
    onError: () => {
      toast.error('Σφάλμα κατά τη διαγραφή');
    },
  });

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      markAsReadMutation.mutate(message.id);
    }
  };

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = 
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'unread' && !msg.is_read) ||
      (filterStatus === 'read' && msg.is_read);
    
    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Μηνύματα Επικοινωνίας</h1>
          <p className="text-muted-foreground">
            {messages.length} μηνύματα συνολικά • {unreadCount} μη αναγνωσμένα
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Αναζήτηση..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Όλα τα μηνύματα</SelectItem>
            <SelectItem value="unread">Μη αναγνωσμένα</SelectItem>
            <SelectItem value="read">Αναγνωσμένα</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Messages Table */}
      {filteredMessages.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Δεν υπάρχουν μηνύματα</h3>
          <p className="text-muted-foreground">
            {searchQuery || filterStatus !== 'all' 
              ? 'Δοκιμάστε διαφορετικά φίλτρα' 
              : 'Τα μηνύματα από τη φόρμα επικοινωνίας θα εμφανίζονται εδώ'}
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Αποστολέας</TableHead>
                <TableHead>Θέμα</TableHead>
                <TableHead className="hidden md:table-cell">Ημερομηνία</TableHead>
                <TableHead className="text-right">Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.map((message, index) => (
                <motion.tr
                  key={message.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className={`border-b border-border hover:bg-muted/50 transition-colors ${
                    !message.is_read ? 'bg-primary/5' : ''
                  }`}
                >
                  <TableCell>
                    {message.is_read ? (
                      <MailOpen className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Mail className="w-4 h-4 text-primary" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className={`font-medium ${!message.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {message.name}
                      </span>
                      <span className="text-xs text-muted-foreground">{message.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={!message.is_read ? 'font-medium' : ''}>
                      {message.subject}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {format(new Date(message.created_at), 'dd MMM yyyy, HH:mm', { locale: el })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewMessage(message)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(message.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl">
          {selectedMessage && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-xl">{selectedMessage.subject}</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(selectedMessage.created_at), 'EEEE, dd MMMM yyyy, HH:mm', { locale: el })}
                    </p>
                  </div>
                  {!selectedMessage.is_read && (
                    <Badge variant="secondary">Νέο</Badge>
                  )}
                </div>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Sender Info */}
                <div className="grid gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{selectedMessage.name}</p>
                      <p className="text-sm text-muted-foreground">Όνομα</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <a href={`mailto:${selectedMessage.email}`} className="font-medium hover:underline">
                        {selectedMessage.email}
                      </a>
                      <p className="text-sm text-muted-foreground">Email</p>
                    </div>
                  </div>
                  {selectedMessage.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <a href={`tel:${selectedMessage.phone}`} className="font-medium hover:underline">
                          {selectedMessage.phone}
                        </a>
                        <p className="text-sm text-muted-foreground">Τηλέφωνο</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Μήνυμα
                  </h4>
                  <div className="p-4 bg-muted/30 rounded-lg whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button asChild className="flex-1">
                    <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Απάντηση
                    </a>
                  </Button>
                  {selectedMessage.phone && (
                    <Button variant="outline" asChild>
                      <a href={`tel:${selectedMessage.phone}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        Κλήση
                      </a>
                    </Button>
                  )}
                  <Button 
                    variant="destructive" 
                    onClick={() => deleteMutation.mutate(selectedMessage.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}