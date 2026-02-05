import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../context/AuthContext';
import { uploadDocument } from '../../api/documents';
import { handleApiError } from '../../utils/errorHandler';
import { DOC_TYPES, STATES, STATE_LABELS } from '../../utils/constants';
import { DOC_TYPE_LABELS } from '../../utils/constants';
import './Documents.css';

const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPT = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

export default function UploadDocument() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, formState, setValue } = useForm({
    defaultValues: { title: '', docType: 'HALL_TICKET', state: user?.state || 'AP' },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxSize: MAX_SIZE,
    accept: ACCEPT,
    multiple: false,
    onDrop: (accepted) => {
      setFile(accepted[0] || null);
    },
  });

  const onSubmit = async (data) => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', data.title);
    formData.append('docType', data.docType);
    formData.append('state', data.state);

    try {
      await uploadDocument(formData);
      toast.success('Document uploaded successfully. Waiting for Super Admin approval.');
      setFile(null);
      setValue('title', '');
      navigate('/documents/my-uploads');
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="documents-page">
      <h1>Upload Document</h1>
      <p className="section-desc">PDF, JPG, PNG, DOC, DOCX (max 10MB)</p>

      <form onSubmit={handleSubmit(onSubmit)} className="form-card">
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
        >
          <input {...getInputProps()} />
          {file ? (
            <p>{file.name}</p>
          ) : (
            <p>{isDragActive ? 'Drop the file here' : 'Drag & drop or click to select'}</p>
          )}
        </div>

        <div className="form-group">
          <label>Title *</label>
          <input
            {...register('title', { required: 'Title is required' })}
            placeholder="Document title"
          />
          {formState.errors.title && (
            <span className="error">{formState.errors.title.message}</span>
          )}
        </div>
        <div className="form-group">
          <label>Type *</label>
          <select {...register('docType', { required: true })}>
            {DOC_TYPES.map((t) => (
              <option key={t} value={t}>
                {DOC_TYPE_LABELS[t] || t}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>State *</label>
          <select {...register('state', { required: true })}>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {STATE_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-primary" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>
    </div>
  );
}
