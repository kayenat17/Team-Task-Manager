import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getAuthSession();
  
  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  // Fetch all tasks from projects the user is a member of or owner of
  const tasksInUserProjects = await prisma.task.findMany({
    where: {
      project: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      }
    },
    include: { project: true, assignee: true },
    orderBy: { createdAt: 'desc' }
  });

  // Fetch specific tasks assigned to the user
  const myTasks = tasksInUserProjects.filter((t: any) => t.assigneeId === userId);

  // Fetch projects owned by or member of
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } }
      ]
    },
    include: {
      _count: {
        select: { tasks: true }
      }
    },
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  // Stats reflect ALL tasks in the user's projects (Ecosystem view)
  const todoTasks = tasksInUserProjects.filter((t: any) => t.status === "TODO");
  const inProgressTasks = tasksInUserProjects.filter((t: any) => t.status === "IN_PROGRESS");
  const doneTasks = tasksInUserProjects.filter((t: any) => t.status === "DONE");

  return (
    <div className="page-content">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'flex-end', marginBottom: '4rem', gap: '2rem' }}>
        <div>
          <p className="lux-stat-label" style={{ marginBottom: '1rem' }}>Your Command Center</p>
          <h1 style={{ fontSize: '7rem', fontWeight: 900, letterSpacing: '-0.06em' }}>HELLO, {session.user?.name?.split(" ")[0].toUpperCase()}</h1>
        </div>
        <Link href="/projects" className="btn-lux btn-lux-primary" style={{ height: 'fit-content', marginBottom: '1rem' }}>CREATE PROJECT</Link>
      </div>

      <div className="bento-grid">
        <div className="bento-item" style={{ background: 'var(--primary)', color: 'white' }}>
          <p style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.1em', opacity: 0.8 }}>SYSTEM TO DO</p>
          <p style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1 }}>{todoTasks.length}</p>
        </div>
        <div className="bento-item">
          <p className="lux-stat-label">SYSTEM PROGRESS</p>
          <p className="lux-stat-val" style={{ color: 'var(--primary)' }}>{inProgressTasks.length}</p>
        </div>
        <div className="bento-item">
          <p className="lux-stat-label">SYSTEM COMPLETED</p>
          <p className="lux-stat-val">{doneTasks.length}</p>
        </div>

        {/* Active Projects Section */}
        <div className="bento-item" style={{ gridColumn: 'span 4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h2 className="widget-title" style={{ margin: 0 }}>ACTIVE ECOSYSTEMS</h2>
            <Link href="/projects" style={{ color: 'var(--text-muted)', fontWeight: 800, fontSize: '0.875rem' }}>VIEW ALL</Link>
          </div>
          
          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>No projects found. Launch your first project to start tracking.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {projects.map(project => (
                <Link href={`/projects/${project.id}`} key={project.id} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '2rem', background: '#fcfcfc', borderRadius: '1.5rem', border: '1px solid var(--border)', transition: 'transform 0.3s' }} className="project-mini-card">
                    <h3 style={{ fontWeight: 900, fontSize: '1.5rem', color: 'var(--text-main)' }}>{project.name.toUpperCase()}</h3>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.5rem' }}>{project._count.tasks} TASKS TRACKED</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Your Tasks Section */}
        <div className="bento-item" style={{ gridColumn: 'span 4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h2 className="widget-title" style={{ margin: 0 }}>YOUR PERSONAL MISSIONS</h2>
          </div>
          
          {myTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>No tasks specifically assigned to you yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {myTasks.map(task => (
                <div key={task.id} style={{ padding: '1.75rem', background: '#fcfcfc', borderRadius: '1.25rem', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--primary-soft)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                      {task.status === 'DONE' ? '✅' : '⏳'}
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 800, fontSize: '1.125rem' }}>{task.title}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{task.project.name}</p>
                    </div>
                  </div>
                  <div className={`status-badge status-${task.status.toLowerCase().replace('_', '')}`}>
                    {task.status.replace("_", " ")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
