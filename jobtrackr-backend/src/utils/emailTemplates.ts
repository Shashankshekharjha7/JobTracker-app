export const followUpReminderEmail = (jobData: {
  company: string;
  role: string;
  appliedDate: Date;
  daysAgo: number;
}) => {
  return {
    subject: `Follow-up reminder: ${jobData.company} - ${jobData.role}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Time to Follow Up! 📧</h2>
        <p>Hi there,</p>
        <p>It's been <strong>${jobData.daysAgo} days</strong> since you applied to:</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Company:</strong> ${jobData.company}</p>
          <p style="margin: 5px 0;"><strong>Role:</strong> ${jobData.role}</p>
          <p style="margin: 5px 0;"><strong>Applied:</strong> ${jobData.appliedDate.toLocaleDateString()}</p>
        </div>
        <p>Consider sending a follow-up email to check on your application status!</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          - JobTrackr
        </p>
      </div>
    `,
  };
};

export const interviewReminderEmail = (jobData: {
  company: string;
  role: string;
  interviewDate: Date;
}) => {
  return {
    subject: `Interview Reminder: ${jobData.company} - Tomorrow!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Interview Tomorrow! 🎯</h2>
        <p>Hi there,</p>
        <p>You have an interview coming up tomorrow:</p>
        <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
          <p style="margin: 5px 0;"><strong>Company:</strong> ${jobData.company}</p>
          <p style="margin: 5px 0;"><strong>Role:</strong> ${jobData.role}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${jobData.interviewDate.toLocaleString()}</p>
        </div>
        <p><strong>Tips:</strong></p>
        <ul style="color: #374151;">
          <li>Review the job description</li>
          <li>Research the company</li>
          <li>Prepare your questions</li>
          <li>Test your tech setup (if virtual)</li>
        </ul>
        <p style="margin-top: 20px;">Good luck! 🍀</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          - JobTrackr
        </p>
      </div>
    `,
  };
};

export const weeklySummaryEmail = (userData: {
  name: string;
  stats: {
    totalApplied: number;
    interviews: number;
    offers: number;
    rejected: number;
  };
  recentJobs: Array<{
    company: string;
    role: string;
    status: string;
  }>;
}) => {
  return {
    subject: `Your Weekly Job Search Summary 📊`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Weekly Summary 📊</h2>
        <p>Hi ${userData.name},</p>
        <p>Here's your job search activity for this week:</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">This Week's Stats</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div style="background: white; padding: 10px; border-radius: 5px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #2563eb;">${userData.stats.totalApplied}</div>
              <div style="color: #6b7280; font-size: 14px;">Applied</div>
            </div>
            <div style="background: white; padding: 10px; border-radius: 5px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">${userData.stats.interviews}</div>
              <div style="color: #6b7280; font-size: 14px;">Interviews</div>
            </div>
            <div style="background: white; padding: 10px; border-radius: 5px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #059669;">${userData.stats.offers}</div>
              <div style="color: #6b7280; font-size: 14px;">Offers</div>
            </div>
            <div style="background: white; padding: 10px; border-radius: 5px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #dc2626;">${userData.stats.rejected}</div>
              <div style="color: #6b7280; font-size: 14px;">Rejected</div>
            </div>
          </div>
        </div>

        ${userData.recentJobs.length > 0 ? `
          <h3>Recent Applications</h3>
          <ul style="list-style: none; padding: 0;">
            ${userData.recentJobs.map(job => `
              <li style="background-color: #f9fafb; padding: 10px; margin: 5px 0; border-radius: 5px;">
                <strong>${job.company}</strong> - ${job.role}
                <span style="color: #6b7280; font-size: 14px;">(${job.status})</span>
              </li>
            `).join('')}
          </ul>
        ` : '<p>No applications this week. Keep going! 💪</p>'}

        <p style="margin-top: 30px;">Keep up the great work!</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          - JobTrackr
        </p>
      </div>
    `,
  };
};