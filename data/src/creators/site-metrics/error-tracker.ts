import type { Site } from "../../types";
import type { SiteProcessingError } from "./site-metrics-schema";

/**
 * Tracks errors during site metrics processing
 */
export class ErrorTracker {
  private errors: SiteProcessingError[] = [];

  /**
   * Record an error for a site
   */
  addError(
    site: Site,
    errorMessage: string,
    step: SiteProcessingError["step"],
  ): void {
    this.errors.push({
      site_id: site.id,
      site_name: site.name ?? "",
      error_message: errorMessage,
      step,
    });
  }

  /**
   * Get all recorded errors
   */
  getErrors(): SiteProcessingError[] {
    return [...this.errors];
  }

  /**
   * Check if any errors occurred
   */
  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  /**
   * Get count of errors
   */
  getErrorCount(): number {
    return this.errors.length;
  }

  /**
   * Log errors to console
   */
  logErrors(): void {
    if (this.errors.length === 0) return;

    console.error(
      `\n❌ ${this.errors.length} error(s) occurred during processing:`,
    );
    this.errors.forEach((err, idx) => {
      console.error(
        `  ${idx + 1}. Site ${err.site_id}${err.site_name ? ` (${err.site_name})` : ""} - ${err.step}: ${err.error_message}`,
      );
    });
  }
}
