"use client";

import { useTransition } from "react";

interface TaskStatusSelectorProps {
  taskId: string;
  currentStatus: string;
  updateAction: (formData: FormData) => Promise<void>;
}

export default function TaskStatusSelector({ taskId, currentStatus, updateAction }: TaskStatusSelectorProps) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const formData = new FormData();
    formData.append("taskId", taskId);
    formData.append("status", e.target.value);
    
    startTransition(async () => {
      await updateAction(formData);
    });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <span className={`status-badge status-${currentStatus.toLowerCase().replace("_", "")}`}>
        {currentStatus.replace("_", " ")}
      </span>
      <select 
        name="status" 
        className="lux-input" 
        defaultValue={currentStatus} 
        onChange={handleChange}
        disabled={isPending}
        style={{ 
          padding: '0.5rem 1rem', 
          width: 'auto', 
          fontSize: '0.8125rem', 
          fontWeight: 800,
          opacity: isPending ? 0.5 : 1,
          transition: 'opacity 0.2s'
        }}
      >
        <option value="TODO">TO DO</option>
        <option value="IN_PROGRESS">PROGRESS</option>
        <option value="DONE">DONE</option>
      </select>
    </div>
  );
}
