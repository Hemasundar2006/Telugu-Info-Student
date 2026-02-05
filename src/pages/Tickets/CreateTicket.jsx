import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { createTicket } from '../../api/tickets';
import { handleApiError } from '../../utils/errorHandler';
import './Tickets.css';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().optional(),
});

export default function CreateTicket() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: '', description: '' },
  });

  const onSubmit = async (data) => {
    try {
      await createTicket({ title: data.title, description: data.description || undefined });
      toast.success('Ticket created successfully. Support will contact you soon.');
      navigate('/tickets');
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  return (
    <div className="tickets-page">
      <h1>Create Ticket</h1>
      <p className="section-desc">Describe your issue</p>

      <form onSubmit={handleSubmit(onSubmit)} className="form-card">
        <div className="form-group">
          <label>Title *</label>
          <input {...register('title')} placeholder="Brief title" />
          {formState.errors.title && (
            <span className="error">{formState.errors.title.message}</span>
          )}
        </div>
        <div className="form-group">
          <label>Description (optional)</label>
          <textarea {...register('description')} rows={4} placeholder="More details..." />
        </div>
        <button type="submit" className="btn-primary" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  );
}
