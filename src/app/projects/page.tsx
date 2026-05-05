import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function ProjectsPage() {
  const session = await getAuthSession();
  
  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { members: { some: { userId } } }
      ]
    },
    include: {
      _count: {
        select: { tasks: true, members: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  async function createProject(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    
    if (!name) return;

    await prisma.project.create({
      data: {
        name,
        description,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: "ADMIN"
          }
        }
      }
    });

    revalidatePath("/projects");
  }

  return (
    <div className="page-content">
      <div style={{ marginBottom: '4rem' }}>
        <p className="lux-stat-label" style={{ marginBottom: '1rem' }}>Ecosystem Management</p>
        <h1 style={{ fontSize: '7rem', fontWeight: 900, letterSpacing: '-0.06em' }}>PROJECTS</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3rem', alignItems: 'flex-start' }}>
        <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', padding: 0 }}>
          {projects.map(project => (
            <Link href={`/projects/${project.id}`} key={project.id} style={{ textDecoration: 'none' }}>
              <div className="bento-item" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{project.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', flex: 1, lineHeight: 1.5 }}>{project.description || "Building the next generation of digital products."}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)', fontSize: '0.8125rem', fontWeight: 800, borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                  <span>{project._count.tasks} TASKS</span>
                  <span>{project._count.members} MEMBERS</span>
                </div>
              </div>
            </Link>
          ))}
          {projects.length === 0 && (
            <div className="bento-item" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '6rem 2rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>No projects in your ecosystem yet.</p>
            </div>
          )}
        </div>

        <div className="bento-item" style={{ position: 'sticky', top: '140px', padding: '3rem' }}>
          <h2 className="widget-title">NEW PROJECT</h2>
          <form action={createProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div>
              <label className="lux-stat-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Project Name</label>
              <input type="text" name="name" className="lux-input" placeholder="e.g. Apollo Launch" required />
            </div>
            <div>
              <label className="lux-stat-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Description</label>
              <textarea name="description" className="lux-input" rows={4} placeholder="Describe the mission..."></textarea>
            </div>
            <button type="submit" className="btn-lux btn-lux-primary" style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}>LAUNCH</button>
          </form>
        </div>
      </div>
    </div>
  );
}
