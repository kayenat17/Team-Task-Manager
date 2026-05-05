import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import TaskStatusSelector from "@/components/TaskStatusSelector";

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAuthSession();
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      tasks: {
        include: { assignee: true },
        orderBy: { createdAt: 'desc' }
      },
      members: {
        include: { user: true }
      }
    }
  });

  if (!project) redirect("/projects");

  const userMembership = project.members.find(m => m.userId === userId);
  const isAdmin = userMembership?.role === "ADMIN" || project.ownerId === userId;
  const isMember = !!userMembership || project.ownerId === userId;

  if (!isMember) redirect("/projects");

  async function createTask(formData: FormData) {
    "use server";
    // Server-side RBAC check
    const session = await getAuthSession();
    if (!session?.user) return;
    const userId = (session.user as any).id;
    
    const membership = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: id, userId } }
    });
    
    // Only admins or owner can create tasks
    const projectCheck = await prisma.project.findUnique({ where: { id } });
    if (membership?.role !== "ADMIN" && projectCheck?.ownerId !== userId) {
      throw new Error("Unauthorized: Only Admins can create tasks.");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const assigneeId = formData.get("assigneeId") as string;

    if (!title) return;

    await prisma.task.create({
      data: {
        title,
        description,
        projectId: id,
        assigneeId: assigneeId || null,
        status: "TODO"
      }
    });
    revalidatePath(`/projects/${id}`);
  }

  async function updateTaskStatus(formData: FormData) {
    "use server";
    const taskId = formData.get("taskId") as string;
    const status = formData.get("status") as string;

    await prisma.task.update({
      where: { id: taskId },
      data: { status }
    });
    revalidatePath(`/projects/${id}`);
  }

  return (
    <div className="page-content">
      <div style={{ marginBottom: '5rem' }}>
        <p className="lux-stat-label" style={{ marginBottom: '1rem' }}>Project Mission</p>
        <h1 style={{ fontSize: '6rem', fontWeight: 900, letterSpacing: '-0.06em' }}>{project.name.toUpperCase()}</h1>
        <p style={{ fontSize: '1.5rem', color: 'var(--text-muted)', marginTop: '1rem', maxWidth: '800px' }}>{project.description || "Leading this project to completion with modern task tracking."}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr 400px' : '1fr', gap: '3rem', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 className="widget-title" style={{ fontSize: '2rem' }}>TASKS STATUS</h2>
          {project.tasks.length === 0 ? (
             <div className="bento-item" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
               <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
               <p style={{ color: 'var(--text-muted)' }}>No tasks tracked in this ecosystem yet.</p>
             </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {project.tasks.map(task => (
                <div key={task.id} className="bento-item" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem' }}>{task.title}</h4>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', marginBottom: '1rem', maxWidth: '400px' }}>{task.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                       <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900 }}>
                        {task.assignee?.name?.[0].toUpperCase() || "?"}
                       </div>
                       <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)' }}>{task.assignee?.name || "UNASSIGNED"}</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <TaskStatusSelector 
                      taskId={task.id} 
                      currentStatus={task.status} 
                      updateAction={updateTaskStatus} 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ONLY SHOW ADMIN PANEL IF USER HAS ADMIN RIGHTS */}
        {isAdmin && (
          <div className="bento-item" style={{ position: 'sticky', top: '140px', padding: '3rem' }}>
            <h2 className="widget-title">ADMIN PANEL</h2>
            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '2rem', textTransform: 'uppercase' }}>Project Management Controls</p>
            
            <form action={createTask} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="lux-stat-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Task Title</label>
                <input type="text" name="title" className="lux-input" placeholder="What needs to be done?" required />
              </div>
              <div>
                <label className="lux-stat-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Description</label>
                <textarea name="description" className="lux-input" rows={2} placeholder="Add details..."></textarea>
              </div>
              <div>
                <label className="lux-stat-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Assignee</label>
                <select name="assigneeId" className="lux-input" style={{ fontWeight: 700 }}>
                  <option value="">UNASSIGNED</option>
                  {project.members.map(m => (
                    <option key={m.userId} value={m.userId}>{m.user.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-lux btn-lux-primary" style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}>ADD TASK</button>
            </form>

            <div style={{ marginTop: '3rem' }}>
              <h3 className="lux-stat-label" style={{ marginBottom: '1.5rem' }}>TEAM SQUAD</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {project.members.map(m => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9375rem', fontWeight: 700 }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--bg-chic)', border: '1px solid var(--border)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '0.8rem' }}>
                      {m.user.name?.[0].toUpperCase()}
                    </div>
                    <div>
                      <p style={{ lineHeight: 1 }}>{m.user.name}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '0.25rem' }}>{m.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
